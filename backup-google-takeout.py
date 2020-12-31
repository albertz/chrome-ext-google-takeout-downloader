#!/usr/bin/env python3

"""
Store into Git Annex
"""

import better_exchook
from subprocess import check_call, check_output
import os
import atexit
from argparse import ArgumentParser
import tempfile
import shutil


target_annex_dir = "/mnt/data4-2020/Annex/GoogleTakeout"  # TODO configurable ...


def get_temp_dir() -> str:
    d = tempfile.mkdtemp(suffix="-backup-google-takeout")

    def cleanup():
        print("At exit, cleanup tmp dir:", d)
        shutil.rmtree(d)
    
    atexit.register(cleanup)
    return d


def is_git_state_clean() -> bool:
    out = check_output(["git", "status", "--porcelain"])
    return len(out.strip()) == 0


def cmd(*args):
    print("$ %s" % " ".join(args))
    check_call(args)


def handle_tmp_extracted(dir: str):
    """
    dir content will be deleted!
    """
    if not dir.startswith("/"):
        dir = os.path.absname(dir)
    import_name = os.path.basename(dir)
    sub_dir = f"{dir}/Takeout"
    assert os.path.isdir(dir) and os.path.isdir(sub_dir)
    assert os.path.isdir(target_annex_dir)
    old_cwd = os.getcwd()
    os.chdir(target_annex_dir)
    for name in os.listdir(sub_dir):
        cmd("git-annex", "import", "--force", f"{sub_dir}/{name}")
        if not is_git_state_clean():
            cmd("git", "commit", "-m", f"import Google Takeout {import_name} / {name}")

    os.chdir(old_cwd)
    print("Temp extracted dir was:", dir)


def handle_zip(path: str):
    assert path.endswith(".zip")
    name, _ = os.path.splitext(os.path.basename(path))
    extract_dir = f"{get_temp_dir()}/{name}"
    # unzip messes up the filename encodings. 7z handles it correctly.
    cmd("7z", "x", path, f"-o{extract_dir}")
    assert os.path.isdir(extract_dir)
    handle_tmp_extracted(extract_dir)

    print("Remove zip:", path)
    os.remove(path)


def main():
    arg_parser = ArgumentParser()
    arg_parser.add_argument("--handle-zip")
    arg_parser.add_argument("--handle-extracted-dir")
    args = arg_parser.parse_args()

    if args.handle_zip:
        handle_zip(args.handle_zip)

    if args.handle_extracted_dir:
        handle_tmp_extracted(args.handle_extracted_dir)


if __name__ == "__main__":
    better_exchook.install()
    main()
