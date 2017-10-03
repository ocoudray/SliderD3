from .__meta__ import version_info, __version__

from .example import *

def _jupyter_nbextension_paths():
    return [{
        'section': 'notebook',
        'src': 'static',
        'dest': 'widget-d3-slider',
        'require': 'widget-d3-slider/extension'
    }]
