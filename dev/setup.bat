pushd %0\..\..
wt.exe -d . sass --watch .:. ; split-pane python -m http.server 80
popd