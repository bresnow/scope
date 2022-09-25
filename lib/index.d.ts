/// <reference types="node" />
/// <reference types="node" />
import fs from 'fs-extra';
import 'gun/lib/path.js';
declare module 'gun/types' {
    interface IGunInstance<TNode> {
        scope(what: string[], callback: ScopeCb | undefined, opts: {
            verbose?: boolean;
            alias?: string;
            encoding?: BufferEncoding | undefined;
        }): Promise<void>;
        unpack(opts: {
            alias?: string;
            encoding: BufferEncoding | undefined;
        }): void;
    }
    interface IGunUserInstance {
        scope(what: string[], callback: ScopeCb | undefined, opts: {
            verbose?: boolean;
            alias?: string;
            encoding?: BufferEncoding | undefined;
        }): Promise<void>;
        unpack(opts: {
            alias?: string;
            encoding: BufferEncoding | undefined;
        }): void;
    }
    interface IGunChain<TNode> {
        scope(what: string[], callback: ScopeCb | undefined, opts: {
            verbose?: boolean;
            alias?: string;
            encoding?: BufferEncoding | undefined;
        }): Promise<void>;
        unpack(opts: {
            alias?: string;
            encoding: BufferEncoding | undefined;
        }): void;
    }
}
export declare type ScopeCb = (path?: string, event?: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir', matches?: string[]) => void;
export declare function exists(path: string): Promise<fs.Stats>;
export declare function interpretPath(...args: string[]): string;
export declare function write(path: any, content: string, encoding?: BufferEncoding): Promise<void>;
export declare function read(path: string, encoding?: BufferEncoding): Promise<string | Buffer>;
