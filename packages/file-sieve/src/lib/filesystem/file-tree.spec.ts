import {FileTreeDirectoryNode} from "./file-tree";
import {LogLevel, LogMessage} from "../log/logger";

describe('FileTree', () => {
   it('should move file to correct path', () => {
     // Arrange
     const year = new FileTreeDirectoryNode('2023');
     const month = year.addDirectory('02');
     const file = month.addFile(
       {
         path: './test/file-1.jpg',
         createdAt: new Date('2023-02-17T10:37:08.000Z')
       }
     );

      file.copy({
        copyFile(source: string, destination: string): Promise<LogMessage> {
          expect(source).toEqual('./test/file-1.jpg');
          expect(destination).toEqual('2023/02/file-1.jpg');
          return Promise.resolve({
            level: LogLevel.Success,
            message: 'File moved'
          });
        }
      });
   });
});
