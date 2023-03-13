import {File, FileCopier, FileMover, FileToRelocate} from "./file";
import {DateParser} from "../date-parser";
import {LogMessage} from "../log/logger";

abstract class FileTreeNode {
  private parent: FileTreeNode | null = null;
  setParent(parent: FileTreeNode): void {
    this.parent = parent;
  }
}

export class FileTreeDirectoryNode extends FileTreeNode {
  constructor(private readonly path: string) {
    super();
  }
  addFile(file: File): FileTreeFileNode {
    const fileNode = new FileTreeFileNode(new FileToRelocate(file, this.path));
    fileNode.setParent(this);
    return fileNode;
  }

  addDirectory(pathPart: string): FileTreeDirectoryNode {
    const directory = new FileTreeDirectoryNode(this.path + '/' + pathPart);
    directory.setParent(this);
    return directory;
  }
}

export class FileTreeFileNode extends FileTreeNode {
  constructor(private readonly file: FileToRelocate) {
    super();
  }

  copy(fs: FileCopier): Promise<LogMessage> {
    return this.file.copy(fs);
  }

  move(fs: FileMover): Promise<LogMessage> {
    return this.file.move(fs);
  }
}

export class FileTreeBuilder {
  buildTree(files: File[], destinationDirectory: string): FileTreeFileNode[] {
    const root = new FileTreeDirectoryNode(destinationDirectory);
    return files.reduce<{
      directory: Record<string, FileTreeDirectoryNode>,
      files: FileTreeFileNode[]
    }>((acc, file) => {
      const year = DateParser.getYear(file.createdAt);
      const yearNode = acc.directory[year] || root.addDirectory(year.toString());
      acc.directory[year] = yearNode;

      const month = DateParser.getMonth(file.createdAt);
      const monthNode = acc.directory[year + '/' + month] || yearNode.addDirectory(month.toString());
      acc.directory[year + '/' + month] = monthNode;

      const fileNode = monthNode.addFile(file);
      acc.files = [...acc.files, fileNode];
      return acc;
    }, {directory: {}, files: []}).files;
  }
}


