# sn-egg-view-hbs

egg view plugin for handlebars

## Install

```bash
$ npm i sn-egg-view-hbs --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.handlebars = {
  enable: true,
  package: 'sn-egg-view-hbs',
};
```

```js
// {app_root}/config/config.default.js
/**
 * view
 * @member
 * @property defaultViewEngine: string setup default view engine
 * @property defaultExtension: string template file extension
 * @property mapping: Object {string: string}
 */
exports.view = {
  defaultViewEngine: 'handlebars',
  defaultExtension: '.hbs',
  mapping: {
    '.hbs': 'handlebars',
  },
};
```

### Register Partial

Partials are loaded from `app/view/partials` by default, you can define `user_message.hbs` and use `userMessage` as partial.

Note:

- The file name will be camelized, e.x. `foo_bar > fooBar`, `foo-bar > fooBar`
- Don't support cascade directory

## Configuration

see [config/config.default.js](config/config.default.js) for more detail.

## Questions & Suggestions

Please open an issue [here](https://github.com/jcrom/sn-egg-view-hbs/issues).

## License

[MIT](LICENSE)
