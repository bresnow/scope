import fs from "fs-extra";
import path from "path";
import Gun from "gun";
import { glob } from "zx";
import "gun/lib/path.js";
import chokidar from "chokidar";
function exists(path2) {
  path2 = interpretPath(path2);
  return fs.stat(path2);
}
function interpretPath(...args) {
  return path.join(process.cwd(), ...args ?? "");
}
async function write(path2, content, encoding = "utf8") {
  path2 = interpretPath(path2);
  return fs.writeFile(path2, content, { encoding });
}
async function read(path2, encoding) {
  path2 = interpretPath(path2);
  return fs.readFileSync(path2, { encoding });
}
Gun.chain.scope = async function(what, callback, { verbose, alias, encoding = "utf8" }) {
  let _gun = this;
  verbose = verbose ?? true;
  alias = alias ?? "scope";
  let matches = await glob(what);
  let scoper = _gun.get(alias);
  try {
    let scope = chokidar.watch(matches, { persistent: true });
    const log = console.log;
    scope.on("all", (event, path2) => {
      if (callback) {
        callback(path2, event, matches);
        if (verbose) {
          log(`scope callback fired : ${event} ${path2}`);
        }
      }
    });
    scope.on("add", async function(_path, stats) {
      if (!exists(_path) || !stats?.isFile()) {
        verbose && log(`File ${_path} does not exist`);
        return;
      }
      let [path2, ext] = _path.split(".");
      let { size } = stats;
      let data = { file: await read(_path, encoding), ext, size };
      scoper.path(path2).put(data);
      verbose && log(`File ${_path} has been added`);
    }).on("change", async function(_path, stats) {
      if (!exists(_path) || !stats?.isFile()) {
        verbose && log(`File ${_path} does not exist`);
        return;
      }
      let [path2, ext] = _path.split(".");
      let { size } = stats;
      let data = { file: await read(_path, encoding), ext, size };
      scoper.path(path2).put(data);
      verbose && log(`File ${_path} has been changed`);
    }).on("unlink", async function(_path) {
      if (!exists(_path)) {
        verbose && log(`File ${_path} does not exist`);
        return;
      }
      let [path2, ext] = _path.split(".");
      scoper.path(path2).put(null);
      verbose && log(`File ${_path} has been removed`);
    });
    if (verbose) {
      scope?.on("addDir", (path2) => log(`Directory ${path2} has been added`)).on("unlinkDir", (path2) => log(`Directory ${path2} has been removed`)).on("error", (error) => log(`Watcher error: ${error}`)).on("ready", () => log("Initial scan complete. Ready for changes"));
    }
  } catch (err) {
    console.log(
      "If you want to use the scope feature, you must install `chokidar` by typing `npm i chokidar` in your terminal."
    );
  }
};
Gun.chain.unpack = function({ alias, encoding }) {
  const log = console.log;
  alias = alias ?? "scope";
  encoding = encoding ?? "utf8";
  let _gun = this;
  let scoper = _gun.get(alias);
  scoper.on((dirs) => {
    delete dirs._;
    Object.keys(dirs).forEach((dir) => {
      let _dir = dir.slice(0, dir.lastIndexOf("/"));
      fs.mkdir(_dir, { recursive: true });
      _gun.path(alias + "." + dir).once(async (data) => {
        if (data) {
          let { file, ext, size } = data;
          await write(dir + "." + ext, file, encoding);
          log(`File ${dir} has been unpacked. size: ${size}`);
        } else {
          log(`File data for ${dir} does not exist`);
        }
      });
    });
  });
};
export {
  exists,
  interpretPath,
  read,
  write
};
