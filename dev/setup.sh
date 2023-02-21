pushd  $(dirname $(dirname $(readlink -fm $0)))
wt.exe -w 0 -d . sass --watch .:. \; split-pane -d . python -m http.server 80
popd


