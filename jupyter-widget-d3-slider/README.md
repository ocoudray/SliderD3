jupyter-widget-d3-slider
===============================

A Custom Jupyter Widget Library

Installation
------------

To install use pip:

    $ pip install widget_d3_slider
    $ jupyter nbextension enable --py --sys-prefix widget_d3_slider


For a development installation (requires npm):

    $ git clone https://github.com/oscar6echo/jupyter-widget-d3-slider.git
    $ cd jupyter-widget-d3-slider
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --sys-prefix widget_d3_slider
    $ jupyter nbextension enable --py --sys-prefix widget_d3_slider


To check where jupyter install extensions:

    $ jupyter --paths
    config:
        /Users/Olivier/.jupyter
        /usr/local/anaconda3/etc/jupyter
        /usr/local/etc/jupyter
        /etc/jupyter
    data:
        /Users/Olivier/Library/Jupyter
        /usr/local/anaconda3/share/jupyter
        /usr/local/share/jupyter
        /usr/share/jupyter
    runtime:
        /Users/Olivier/Library/Jupyter/runtime

The flag `--sys-prefix` means you should look for extensions in folder:

    /usr/local/anaconda3/share/jupyter

There you should see folders or symlink back to your source code folder, for example:

    drwxr-xr-x  4 Olivier  staff   136B Sep 30 18:09 jupyter-js-widgets/
    lrwxr-xr-x  1 Olivier  staff   115B Oct  1 21:11 widget-d3-slider -> /Users/Olivier/Dropbox/Archives/Software/Python/widget-d3-slider-2/jupyter-widget-d3-slider/widget_d3_slider/static

To check nbextensions are properly install and enabled, for example:

    $ jupyter nbextension list
    Known nbextensions:
    config dir: /Users/Olivier/.jupyter/nbconfig
        notebook section
        codefolding/main  enabled 
        - Validating: OK
        comment-uncomment/main  enabled 
        - Validating: OK
        default_style/main  enabled 
        - Validating: OK
    config dir: /usr/local/anaconda3/etc/jupyter/nbconfig
        notebook section
        jupyter-js-widgets/extension  enabled 
        - Validating: OK
        widget-d3-slider/extension  enabled 
        - Validating: OK

The pip installation is standard except for 2 points:
+ the compiled js must be present in static/ beforehand
    + the role of npm and webpack is to build the folder static/ from the js/lib/ source files
    + Note that setup.py is customised so as to run `npm instal` if all of the target files are not in static/
+ the data files are located in `share/jupyter/nbextensions/widget-d3-slider`

If it is a dev install, an `egg-link` file is present in the following folder instead of an `egg-info` folder.

    /usr/local/anaconda3/lib/python3.6/site-packages

In a dev context the simplest step is to run `webpack` i.e.:

    $ npm run prepublish

This re-compile the source js folder into static/ just do the following the first time:

    $ npm install

`npm install` downloads the packages from the internet the first time, then looks for them in ~/.npm afterwards. `npm install` also runs predefined scripts (see which in the [official doc](https://docs.npmjs.com/misc/scripts)) if present like `prepublish` (deprecated, to be updated). 

After static/ is built you can just reload the notebook. The new js is available instantly.  

