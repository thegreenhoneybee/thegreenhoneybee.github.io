goto comment
Requirements:
 - run on `wt`
 - has WSL (Ubuntu) with dart-sass, python3, typescript (npm)
:comment

pushd %0\..\..
@REM -p --Profile, -d --startingDirectory
wt.exe -w 0 -p Ubuntu -d . python -m http.server 80 ; split-pane -H -p Ubuntu -d . sass --watch .:. ; split-pane -p Ubuntu -d . tsc --watch
popd