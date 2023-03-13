import {FileLoader, Sieve} from "./sieve";
import {File} from "./filesystem/file";
import {FileTreeBuilder} from "./filesystem/file-tree";
import {FakeLogger, LogLevel, LogMessage} from "./log/logger";
import {FileSystem} from "./filesystem/file-system";

class DateObjectMother {
  static date202301(): Date {
    return new Date('2023-01-01');
  }

  static date202201(): Date {
    return new Date('2022-01-01');
  }

  static date202302(): Date {
    return new Date('2023-02-01');
  }
}

class FileLoaderMock implements FileLoader {
  loadFilesFromDirectory(directory: string): File[] {
    return [
      {
        path: 'path/to/file1.jpg',
        createdAt: DateObjectMother.date202301(),
      },
      {
        path: 'path/to/file2.jpg',
        createdAt: DateObjectMother.date202201(),
      },
      {
        path: 'path/to/file3.jpg',
        createdAt: DateObjectMother.date202302(),
      }
    ];
  }

  doesDirectoryExist(directory: string): boolean {
    return true;
  }
}

class FileSystemSpy implements FileSystem {
  public readonly spy: [string, string][] = [];

  copyFile(source: string, destination: string): Promise<LogMessage> {
    this.spy.push([source, destination]);
    return Promise.resolve({
      level: LogLevel.Success,
      message: 'File copied'
    });
  }

  moveFile(source: string, destination: string): Promise<LogMessage> {
    this.spy.push([source, destination]);
    return Promise.resolve({
      level: LogLevel.Success,
      message: 'File moved'
    });
  }
}

describe('Sieve', () => {
  it('should move file to correct path', async () => {
    const fileCopierSpy = new FileSystemSpy()
    const sut = new Sieve(new FileLoaderMock(), new FileTreeBuilder(), fileCopierSpy, new FakeLogger());
    await sut.copy('test', 'photos');
    expect(fileCopierSpy.spy).toEqual([
      ['path/to/file1.jpg', 'photos/2023/01/file1.jpg'],
      ['path/to/file2.jpg', 'photos/2022/01/file2.jpg'],
      ['path/to/file3.jpg', 'photos/2023/02/file3.jpg'],
    ]);
  });
});
