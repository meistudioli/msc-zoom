import { _wcl } from './common-lib.js';
import { _wccss } from './common-css.js';

const defaults = {
  active: false,
  duration: 300, // ms
  scale: 2
};

const booleanAttrs = ['active'];
const objectAttrs = [];
const custumEvents = {
  click: 'msc-zoom-click'
};

const template = document.createElement('template');
template.innerHTML = `
<style>
${_wccss}

:host{position:relative;inline-size:100%;block-size:100%;display:block;}

.main {
  --scale-normal: 1;
  --scale-active: ${defaults.scale};
  --scale: var(--scale-normal);

  --duration: ${defaults.duration}ms;
  --transform-origin: 50% 50%;

  --cursor-zoom-in: zoom-in;
  --cursor-zoom-out: zoom-out;
  --cursor: var(--cursor-zoom-in);
}
.main{position:relative;inline-size:100%;block-size:100%;overflow:hidden;cursor:var(--cursor);pointer-events:auto;}
::slotted(img){inline-size:100%;block-size:100%;display:block;transition:transform var(--duration) ease-in-out;transform:scale(var(--scale));transform-origin:var(--transform-origin);will-change:transform;}

.main--basis{}
:host([active]) .main {
  --cursor: var(--cursor-zoom-out);
  --scale: var(--scale-active);
}
</style>

<div class="main main--basis">
  <slot name="msc-zoom-vision"></slot>
</div>
`;

// Houdini Props and Vals
if (CSS?.registerProperty) {
  // CSS.registerProperty({
  //   name: '--msc-collages-gap',
  //   syntax: '<length>',
  //   inherits: true,
  //   initialValue: '1px'
  // });
}

export class MscZoom extends HTMLElement {
  #data;
  #nodes;
  #config;

  constructor(config) {
    super();

    // template
    this.attachShadow({ mode: 'open', delegatesFocus: false });
    this.shadowRoot.appendChild(template.content.cloneNode(true));

    // data
    this.#data = {
      controller: ''
    };

    // nodes
    this.#nodes = {
      styleSheet: this.shadowRoot.querySelector('style'),
      source: ''
    };

    // config
    this.#config = {
      ...defaults,
      ...config // new MscZoom(config)
    };

    // evts
    this._onClick = this._onClick.bind(this);
  }

  async connectedCallback() {
   const { config, error } = await _wcl.getWCConfig(this);

    if (error) {
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${error}`);
      this.remove();
      return;
    } else {
      this.#config = {
        ...this.#config,
        ...config
      };
    }

    // load image source
    try {
      /*
       * Allowing cross-origin use of images and canvas
       * https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
       */
      this.#nodes.source = this.querySelector('img[slot="msc-zoom-vision"]');
      this.#nodes.source.crossOrigin = 'Anonymous';

      await this._loadSource();
    } catch(err) {
      console.warn(`${_wcl.classToTagName(this.constructor.name)}: ${err?.message}`);
      this.remove();
    }

    // upgradeProperty
    Object.keys(defaults).forEach((key) => this._upgradeProperty(key));

    // evts
    this.#data.controller = new AbortController();
    const signal = this.#data.controller.signal;
    this.addEventListener('click', this._onClick, { signal });
  }

  disconnectedCallback() {
    if (this.#data?.controller) {
      this.#data.controller.abort();
    }
  }

  _format(attrName, oldValue, newValue) {
    const hasValue = newValue !== null;

    if (!hasValue) {
      if (booleanAttrs.includes(attrName)) {
        this.#config[attrName] = false;
      } else {
        this.#config[attrName] = defaults[attrName];
      }
    } else {
      switch (attrName) {
        case 'active':
          this.#config[attrName] = true;
          break;
        case 'scale': {
          const scale = +newValue;
          this.#config[attrName] = (isNaN(scale) || scale <= 0) ? defaults.scale : scale;
          break;
        }
        case 'duration': {
          const duration = +newValue;
          this.#config[attrName] = (isNaN(duration) || duration <= 0) ? defaults.duration : duration;
          break;
        }
      }
    }
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (!MscZoom.observedAttributes.includes(attrName)) {
      return;
    }

    this._format(attrName, oldValue, newValue);

    switch (attrName) {
      case 'scale':
        this._setCustomProperties({ scale:this.scale });
        break;
      case 'duration':
        this._setCustomProperties({ duration:this.duration });
        break;
    }
  }

  static get observedAttributes() {
    return Object.keys(defaults); // MscZoom.observedAttributes
  }

  _upgradeProperty(prop) {
    let value;

    if (MscZoom.observedAttributes.includes(prop)) {
      if (Object.prototype.hasOwnProperty.call(this, prop)) {
        value = this[prop];
        delete this[prop];
      } else {
        if (booleanAttrs.includes(prop)) {
          value = (this.hasAttribute(prop) || this.#config[prop]) ? true : false;
        } else if (objectAttrs.includes(prop)) {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : JSON.stringify(this.#config[prop]);
        } else {
          value = this.hasAttribute(prop) ? this.getAttribute(prop) : this.#config[prop];
        }
      }

      this[prop] = value;
    }
  }

  _setCustomProperties(info = {}) {
    const { styleSheet } = this.#nodes;

    const {
      scale = this.scale,
      duration = this.duration,
      origin = '50% 50%'
    } = info;

    _wcl.addStylesheetRules(
      '.main--basis',
      {
        '--scale-active': scale,
        '--transform-origin': origin,
        '--duration': `${duration}ms`
      },
      styleSheet
    );
  }

  set active(value) {
    this.toggleAttribute('active', Boolean(value));
  }

  get active() {
    return this.#config.active;
  }

  set scale(value) {
    if (value) {
      this.setAttribute('scale', value);
    } else {
      this.removeAttribute('scale');
    }
  }

  get scale() {
    return this.#config.scale;
  }

  set duration(value) {
    if (value) {
      this.setAttribute('duration', value);
    } else {
      this.removeAttribute('duration');
    }
  }

  get duration() {
    return this.#config.duration;
  }

  _fireEvent(evtName, detail) {
    this.dispatchEvent(new CustomEvent(evtName,
      {
        bubbles: true,
        composed: true,
        ...(detail && { detail })
      }
    ));
  }

  _loadSource() {
    return new Promise(
      (resolve, reject) => {
        const img = new Image();

        img.onload = () => {
          resolve({
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight
          });
        };
        img.onerror = () => {
          reject();
        };

        img.src = this.#nodes.source.src;
      }
    );
  }

  _onClick(evt) {
    if (this.active) {
      this.active = false;
    } else {
      const { x:pX, y:pY } = _wcl.pointer(evt);
      const { x, y, width, height } = this.getBoundingClientRect();

      const deltaX = pX - x - _wcl.scrollX;
      const deltaY = pY - y - _wcl.scrollY;

      this._setCustomProperties({
        origin: `${(deltaX / width) * 100}% ${(deltaY / height) * 100}%`
      });

      this.active = true;
    }

    this._fireEvent(custumEvents.click, {
      mode: this.active ? 'zoom-in' : 'zoom-out'
    });
  }

  toggle(force) {
    if (typeof force === 'boolean') {
      this.active = force;
    } else {
      this.active = !this.active;
    }
  }
}

// define web component
const S = _wcl.supports();
const T = _wcl.classToTagName('MscZoom');
if (S.customElements && S.shadowDOM && S.template && !window.customElements.get(T)) {
  window.customElements.define(_wcl.classToTagName('MscZoom'), MscZoom);
}