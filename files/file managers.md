```bash
apt install ranger
# append to /etc/bash.bashrc to cd into a dir (Shift+q)
alias mc='. /usr/lib/mc/mc-wrapper.sh'
alias r="ranger"

function ranger {
        local IFS=$'\t\n'
        local tempfile="$(mktemp -t tmp.XXXXXX)"
        local ranger_cmd=(
                command
                ranger
                --cmd="map Q chain shell echo %d > "$tempfile"; quitall"
        )

        ${ranger_cmd[@]} "$@"
        if [[ -f "$tempfile" ]] && [[ "$(cat -- "$tempfile")" != "$(echo -n `pwd`)" ]]; then
                cd -- "$(cat "$tempfile")" || return
        fi
        command rm -f -- "$tempfile" 2>/dev/null
}
```
