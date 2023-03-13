#!/usr/bin/env node
import {Sieve} from "./lib/sieve";
import {DefaultFileSystem, SystemFileLoader} from "./lib/filesystem/file-system";
import {FileTreeBuilder} from "./lib/filesystem/file-tree";
import {ConsoleLogger} from "./lib/log/console";
import yargs from 'yargs';
import {hideBin} from "yargs/helpers";

const sieve = new Sieve(
  new SystemFileLoader(),
  new FileTreeBuilder(),
  new DefaultFileSystem(),
  new ConsoleLogger()
);

const move = async (source: string, destination: string): Promise<void> => {
  return sieve.move(source, destination);
}

const copy = async (source: string, destination: string): Promise<void> => {
  return sieve.copy(source, destination);
}

yargs(hideBin(process.argv))
  .usage('Usage: $0 <command> [options]')
  .example('$0 <command> -s ./source -d ./destination', 'Sieve files from source to destination')
  // .demandOption(['source', 'destination'])
  .command('move', 'Move files from source to destination', (yargs) => {
    return yargs.option('source', {
      alias: 's',
      type: 'string',
      description: 'Source directory'
    })
    .option('destination', {
      alias: 'd',
      type: 'string',
      description: 'Destination directory'
    })
    .demandOption(['source', 'destination']);
  }, (argv) => {
    move(argv.source, argv.destination).then();
  })
  .command('copy', 'Copy files from source to destination', (yargs) => {
    return yargs.option('source', {
      alias: 's',
      type: 'string',
      description: 'Source directory'
    })
    .option('destination', {
      alias: 'd',
      type: 'string',
      description: 'Destination directory'
    })
    .demandOption(['source', 'destination']);
  }, (argv) => {
    copy(argv.source, argv.destination).then();
  })
  .demandCommand()
  .argv;


