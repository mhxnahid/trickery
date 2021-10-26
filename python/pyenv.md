### Installation
```console
curl https://pyenv.run | bash
```
`nano ~/.bashrc`
```bash
export PYENV_ROOT="$HOME/.pyenv"
export PATH="$PYENV_ROOT/bin:$PATH:"

eval "$(pyenv init --path)"
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"
```
Commands
```bash
# list options
pyenv
# install a version
pyenv install 3.6.14
# install with some additional support
env PYTHON_CONFIGURE_OPTS="--enable-shared" pyenv install 3.6.14
# show all versions
pyenv versions
# activate local version
pyenv local 3.6.14
# check
python -V
# create venv
pyenv virtualenv 3.6.14 env3614
# activate venv
pyenv virtualenv env314
$ deactivate
pyenv deactivate
```
