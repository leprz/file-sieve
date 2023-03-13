import {File, FileRelocator} from "./filesystem/file";
import {FileTreeBuilder, FileTreeFileNode} from "./filesystem/file-tree";
import {Logger} from "./log/logger";
import {ProgressLogger} from "./log/progress";
import {FileCopyRelocator, FileMoveRelocator} from "./filesystem/file-relocator";
import {FileSystem} from "./filesystem/file-system";

export class Sieve {
  constructor(
    private readonly fileLoader: FileLoader,
    private readonly fileTreeBuilder: FileTreeBuilder,
    private readonly fileSystem: FileSystem,
    private readonly logger: Logger,
  ) {
  }

  async copy(directory: string, destinationDirectory: string): Promise<void> {
    return this.relocate(directory, destinationDirectory, new FileCopyRelocator(this.fileSystem));
  }

  async move(directory: string, destinationDirectory: string): Promise<void> {
    return this.relocate(directory, destinationDirectory, new FileMoveRelocator(this.fileSystem));
  }

  private async relocate(directory: string, destinationDirectory: string, relocator: FileRelocator): Promise<void> {
    if (!this.fileLoader.doesDirectoryExist(directory)) {
      this.logger.error(`Directory ${directory} does not exist!`);
      return;
    }

    const files: File[] = this.fileLoader.loadFilesFromDirectory(directory);
    const tree: FileTreeFileNode[] = this.fileTreeBuilder.buildTree(files, destinationDirectory);
    const filesLength = tree.length;
    const progressBar = new ProgressLogger(filesLength);

    for (const node of tree) {
      progressBar.log(await relocator.relocate(node));
    }

    progressBar.stop();
    if (progressBar.summary.warn.length === 0 && progressBar.summary.error.length === 0) {
      this.logger.success('Completed with success');
    } else {
      this.logger.info('Completed with:');
    }

    if (progressBar.summary.error.length > 0) {
      this.logger.error(`${progressBar.summary.error.length} errors`);
    }
    if (progressBar.summary.warn.length > 0) {
      this.logger.warn(`${progressBar.summary.warn.length} warnings`);
    }

    progressBar.summary.warn.forEach((logMessage) => {
      this.logger.warn(logMessage.message);
    });

    progressBar.summary.error.forEach((logMessage) => {
      this.logger.error(logMessage.message);
    });
  }
}

export interface FileLoader {
  loadFilesFromDirectory(directory: string): File[];

  doesDirectoryExist(directory: string): boolean;
}
