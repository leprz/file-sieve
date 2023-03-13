import {LogMessage} from "../log/logger";
import {FileTreeFileNode} from "./file-tree";

export interface File {
  readonly createdAt: Date,
  readonly path: string,
}

function getFileName(path: string): string {
  return path.split('/').pop();
}

export class FileToRelocate {
  constructor(
    private readonly file: File,
    private readonly destination: string,
  ) {
  }

  copy(fs: FileCopier): Promise<LogMessage> {
    return fs.copyFile(this.file.path, this.destination + '/' + getFileName(this.file.path));
  }

  move(fs: FileMover): Promise<LogMessage> {
    return fs.moveFile(this.file.path, this.destination + '/' + getFileName(this.file.path));
  }
}

export interface FileRelocator {
  relocate(file: FileTreeFileNode): Promise<LogMessage>;
}

export interface FileCopier {
  copyFile(source: string, destination: string): Promise<LogMessage>;
}

export interface FileMover {
  moveFile(source: string, destination: string): Promise<LogMessage>;
}
