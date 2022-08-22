# msc-zoom

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/msc-zoom) [![DeepScan grade](https://deepscan.io/api/teams/16372/projects/22012/branches/644916/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=16372&pid=22012&bid=644916)

&ly;msc-zoom /> is a web component which provide zoom-in / zoom-out effects for image closing watch. Users could just tap the part they like to have a closing watch.

![<msc-zoom />](https://blog.lalacube.com/mei/img/preview/msc-zoom.png)

## Basic Usage

&lt;msc-zoom /> is a web component. All we need to do is put the required script into your HTML document. Then follow &lt;msc-zoom />'s html structure and everything will be all set.

- Required Script

```html
<script
  type="module"
  src="https://your-domain/wc-msc-zoom.js">        
</script>
```

- Structure

Put img[slot="msc-zoom-vision"] inside &lt;msc-zoom /> as its child. It will use it as source.

```html
<msc-zoom>
  <script type="application/json">
    {
      "active": false,
      "duration": 300,
      "scale": 2
    }
  </script>
  <img src="https://picsum.photos/id/26/1000/670" alt="mas-zoom image" slot="msc-zoom-vision" />
</msc-zoom>
```

## JavaScript Instantiation

&lt;msc-zoom /> could also use JavaScript to create DOM element. Here comes some examples.

```html
<script type="module">
import { MscZoom } from 'https://your-domain/wc-msc-zoom.js';

const content = document.querySelector('img[slot="msc-zoom-vision"]');

// use DOM api
const nodeA = document.createElement('msc-zoom');
nodeA.appendChild(content.cloneNode(true));
document.body.appendChild(nodeA);
nodeA.scale = 2;

// new instance with Class
const nodeB = new MscZoom();
nodeB.appendChild(content.cloneNode(true));
document.body.appendChild(nodeB);
nodeB.scale = 3;

// new instance with Class & default config
const config = {
  scale: 3.5,
  duration: 500
};
const nodeC = new MscZoom(config);
nodeC.appendChild(content.cloneNode(true));
document.body.appendChild(nodeC);
</script>
```

## Style Customization

Developers could apply styles to decorate img[slot="msc-zoom-vision"].

```html
<style>
img[slot="msc-zoom-vision"] {
  object-fit: cover;
}
</style>
```

## Attributes

&lt;msc-zoom /> supports some attributes to let it become more convenience & useful.

- **active**

Set active for &lt;msc-zoom />. It will zoom-in once set true. Default is `false` (not set).

```html
<msc-zoom
  active
>
  <img src="https://picsum.photos/id/635/1000/670" slot="msc-zoom-vision" />
</msc-zoom>
```

- **duration**

Set duration for &lt;msc-zoom /> zoom-in / zoom-out animation. Default is `300` (ms).

```html
<msc-zoom
  duration="300"
>
  <img src="https://picsum.photos/id/635/1000/670" slot="msc-zoom-vision" />
</msc-zoom>
```

- **scale**

Set scale for &lt;msc-zoom />. Default is `2`.

```html
<msc-zoom
  scale="2"
>
  <img src="https://picsum.photos/id/635/1000/670" slot="msc-zoom-vision" />
</msc-zoom>
```


## Properties

| Property Name | Type | Description |
| ----------- | ----------- | ----------- |
| active | Boolean | 	Getter / Setter for active. It will turn on / off zoom effects. |
| duration | Number | Getter / Setter for duration. The zoom animation's duration will apply this value with unit ms. Default is `300`. |
| scale | Number | Getter / Setter for scale. The scale rate will apply this value. Default is `2`. |


## Event

| Event Signature | Description |
| ----------- | ----------- |
| msc-zoom-click | Fired when &lt;msc-zoom /> has been clicked. Developers could get `mode` through `event.detail`. |


## Reference
- [&lt;msc-zoom /&gt;](https://blog.lalacube.com/mei/webComponent_msc-zoom.html)
