for /d /r cms\app\Controller\AdminDropins %%G IN (.) DO call _compileCSS.cmd  %%G
compass compile