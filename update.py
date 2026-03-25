import codecs
import re

def update_file(filepath):
    print(f"Reading {filepath}...")
    with codecs.open(filepath, 'r', 'utf-8') as f:
        content = f.read()
    
    parts = content.split('// --- Calculator Logic ---')
    if len(parts) < 2:
        print(f"Could not find marker in {filepath}")
        return
        
    head = parts[0]
    tail = parts[1]
    
    # Read the new logic
    with codecs.open('new_logic.txt', 'r', 'utf-8') as f:
        new_logic = f.read()
        
    # Figure out the end
    if filepath.endswith('.html'):
        # In HTML, the function closes with })(); then </script>
        # Let's find the last })(); 
        tail_parts = tail.split('})();')
        end_str = '\n        })();' + '})();'.join(tail_parts[1:])
    else:
        # In JS, it ends with })();
        tail_parts = tail.split('})();')
        end_str = '\n})();\n'
        
    new_content = head + '// --- Calculator Logic ---\n\n' + new_logic + end_str
    
    with codecs.open(filepath, 'w', 'utf-8') as f:
        f.write(new_content)
    print(f"Updated {filepath} successfully.")

update_file('script.js')
update_file('星凛 (Seirin).html')
