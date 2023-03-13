import {File, FileCopier, FileMover} from "./file";
import fs from 'fs';
import {FileLoader} from "../sieve";
import {LogLevel, LogMessage} from "../log/logger";

export interface FileSystem extends FileCopier, FileMover {

}
export class DefaultFileSystem implements FileSystem {
  moveFile(source: string, destination: string): Promise<LogMessage> {
    this.ensureDirectoryExistence(destination);
    return new Promise((resolve, reject) => {
      if(fs.existsSync(destination)) {
        resolve({
          level: LogLevel.Warn,
          message: `File ${destination} already exists!`
        });
      } else {
        fs.rename(source, destination, (err) => {
          if (err) {
            reject({
              level: LogLevel.Error,
              message: `Error while moving file ${source} to ${destination}: ${err}`
            });
          }
          resolve({
            level: LogLevel.Success,
            message: `File ${source} moved to ${destination}`
          });
        });
      }
    });
  }

  copyFile(source: string, destination: string): Promise<LogMessage> {
    this.ensureDirectoryExistence(destination);
    return new Promise((resolve, reject) => {
      if(fs.existsSync(destination)) {
        resolve({
          level: LogLevel.Warn,
          message: `File ${destination} already exists!`
        });
      } else {
        fs.copyFile(source, destination, (err) => {
          if (err) {
            reject({
              level: LogLevel.Error,
              message: `Error while copying file ${source} to ${destination}: ${err}`
            });
          }
          resolve({
            level: LogLevel.Success,
            message: `File ${source} copied to ${destination}`
          });
        });
      }
    });
  }

  private ensureDirectoryExistence(filePath): void {
    const dirname = this.getDirname(filePath);
    if (!fs.existsSync(dirname)) {
      this.ensureDirectoryExistence(dirname);
      fs.mkdirSync(dirname);
    }
  }

  private getDirname(path: string): string {
    return path.split('/').slice(0, -1).join('/');
  }
}

export class SystemFileLoader implements FileLoader {
  loadFilesFromDirectory(directory: string): File[] {
    return this.getFilesFromDirRecursively(directory).map((filePath) => {
      const {mtime} = fs.statSync(filePath);

      return {
        path: filePath,
        createdAt: new Date(mtime)
      }
    });
  }

  private getFilesFromDirRecursively(dir): string[] {
    let filePaths: string[] = [];
    for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
      const path = dir + '/' + dirent.name;
      if (dirent.isDirectory()) {
        filePaths = [
          ...filePaths,
          ...this.getFilesFromDirRecursively(path)
        ];
      } else {
        filePaths = [...filePaths, path];
      }
    }
    return filePaths;
  }

  doesDirectoryExist(directory: string): boolean {
    return fs.existsSync(directory) && fs.lstatSync(directory).isDirectory();
  }
}
