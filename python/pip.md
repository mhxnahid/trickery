```bash
#if you have both python 2 and 3 installed, pip and pip3 both could be present and are different
# install a module
pip3 install numpy
# install from file
pip3 install -r requirements.txt
# list all modules
pip3 list
# unistall module
pip3 remove numpy
# remove all modules
pip3 freeze | xargs pip uninstall -y
```
