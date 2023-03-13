import {FileCopier, FileMover, FileRelocator} from "./file";
import {LogMessage} from "../log/logger";
import {FileTreeFileNode} from "./file-tree";

export class FileCopyRelocator implements FileRelocator {
  constructor(
    private readonly fileCopier: FileCopier,
  ) {
  }

  relocate(file: FileTreeFileNode): Promise<LogMessage> {
    return file.copy(this.fileCopier);
  }
}

export class FileMoveRelocator implements FileRelocator {
  constructor(
    private readonly fileMover: FileMover,
  ) {
  }

  relocate(file: FileTreeFileNode): Promise<LogMessage> {
    return file.move(this.fileMover);
  }
}
