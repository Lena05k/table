#!/usr/bin/env python3
"""Add tw- prefix to all Tailwind utility classes in Vue templates."""
import re, os

def find_variant_colon(s: str) -> int:
    """Return index of last ':' outside [...] brackets, or -1."""
    depth = 0
    last_colon = -1
    for i, c in enumerate(s):
        if c == '[':   depth += 1
        elif c == ']': depth -= 1
        elif c == ':' and depth == 0:
            last_colon = i
    return last_colon

# Values used in JS comparisons, not class names
NON_TAILWIND = {
    'left', 'right', 'top', 'bottom', 'table', 'kanban',
    'row-select', 'actions', 'all', 'asc', 'desc',
    'ag-theme-alpine',
}

def is_tailwind(token: str) -> bool:
    if not token:
        return False
    if token.lstrip('-').startswith('ag-'):
        return False
    if token in NON_TAILWIND:
        return False
    return True

def prefix_token(token: str) -> str:
    if not is_tailwind(token):
        return token
    negative = token.startswith('-')
    s = token[1:] if negative else token
    cp = find_variant_colon(s)
    if cp >= 0:
        variant  = s[:cp + 1]
        utility  = s[cp + 1:]
        if utility.startswith('-'):
            result = variant + '-tw-' + utility[1:]
        else:
            result = variant + 'tw-' + utility
    else:
        result = 'tw-' + s
    return ('-' if negative else '') + result

def transform_class_list(cls: str) -> str:
    return ' '.join(prefix_token(t) for t in cls.split())

def is_class_string(s: str) -> bool:
    tokens = s.split()
    if len(tokens) > 1:          # multi-token → definitely a class list
        return True
    t = tokens[0] if tokens else ''
    if not t:
        return False
    if t in NON_TAILWIND:
        return False
    if t.lstrip('-').startswith('ag-'):
        return False
    if ':' in t:                 # has variant → definitely Tailwind
        return True
    if '-' in t:
        for p in ('menu-drop', 'slide-', 'fade-', 'row-select'):
            if t.startswith(p):
                return False
        return True
    # single word without hyphen — allow known single-word utilities
    return t in {
        'flex', 'hidden', 'block', 'inline', 'relative', 'absolute', 'fixed',
        'sticky', 'overflow', 'truncate', 'underline', 'italic', 'rounded',
        'shadow', 'grow', 'shrink', 'transition', 'uppercase', 'lowercase',
        'capitalize', 'resize', 'ring', 'border', 'static', 'visible', 'invisible',
    }

def transform_dynamic_class(val: str) -> str:
    def replace_quoted(m: re.Match) -> str:
        content = m.group(1)
        if is_class_string(content):
            return "'" + transform_class_list(content) + "'"
        return m.group(0)
    return re.sub(r"'([^']*)'", replace_quoted, val)

def transform_content(content: str) -> str:
    # Static class="..." — negative lookbehind prevents matching :class="..."
    def replace_static(m: re.Match) -> str:
        return 'class="' + transform_class_list(m.group(1)) + '"'
    content = re.sub(r'(?<!:)class="([^"]*)"', replace_static, content)

    # Dynamic :class="..."  (value may span multiple lines)
    def replace_dynamic(m: re.Match) -> str:
        return ':class="' + transform_dynamic_class(m.group(1)) + '"'
    content = re.sub(r':class="([^"]*)"', replace_dynamic, content)

    return content

FILES = [
    'views/documents/DocumentPage.vue',
    'views/documents/DocumentsTable.vue',
    'views/documents/components/ActionsCellRenderer.vue',
    'views/documents/components/ColumnConfigPanel.vue',
    'views/documents/components/DocumentFilterBar.vue',
    'views/documents/components/DocumentHeader.vue',
    'views/documents/components/DocumentPagination.vue',
    'views/documents/components/DocumentStatsRow.vue',
    'views/documents/components/DocumentTable.vue',
    'views/documents/components/DocumentToolbar.vue',
    'views/documents/components/DocumentViewTabs.vue',
    'views/documents/components/LinkCellRenderer.vue',
    'views/documents/components/RadioCellRenderer.vue',
    'views/documents/components/blocks/OperationsBlock.vue',
    'views/documents/components/blocks/PostalWorkBlock.vue',
    'views/documents/components/blocks/StageCountBlock.vue',
]

base = os.path.join(os.path.dirname(__file__), '..')
for rel in FILES:
    fp = os.path.join(base, rel)
    with open(fp, 'r') as f:
        original = f.read()
    transformed = transform_content(original)
    if transformed != original:
        with open(fp, 'w') as f:
            f.write(transformed)
        print(f'Updated : {rel}')
    else:
        print(f'No change: {rel}')

print('\nDone.')
