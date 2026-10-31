from pathlib import Path

IGNORE = {"__pycache__", "venv", ".venv", ".git", "node_modules", ".pytest_cache", ".mypy_cache"}

def print_tree(directory: Path, prefix: str = ""):
    entries = sorted(
        [e for e in directory.iterdir() if e.name not in IGNORE],
        key=lambda e: (e.is_file(), e.name.lower()),
    )
    for i, entry in enumerate(entries):
        last = i == len(entries) - 1
        connector = "└── " if last else "├── "
        print(f"{prefix}{connector}{entry.name}")
        if entry.is_dir():
            extension = "    " if last else "│   "
            print_tree(entry, prefix + extension)

print(Path(".").name)
print_tree(Path("."))