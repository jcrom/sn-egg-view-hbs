'use strict';

const path = require('path');
const fs = require('mz/fs');
const handlebars = require('handlebars');

const COMPILE = Symbol('compile');

module.exports = app => {
  const partials = loadPartial(app);
  if (partials) {
    for (const key of Object.keys(partials)) {
      handlebars.registerPartial(key, partials[key]);
    }
  }

  // const helpers = loadHelper(app);
  // if (helpers) {
  //   for (const key of Object.keys(helpers)) {
  //     handlebars.registerHelper(key, helpers[key]);
  //   }
  // }
  class HandlebarsView {
    constructor(ctx) {
      this.app = ctx.app;
    }

    async render(name, context, options) {
      const content = await fs.readFile(name, 'utf8');
      return this[COMPILE](content, context, options);
    }

    async renderString(tpl, context, options) {
      return this[COMPILE](tpl, context, options);
    }

    [COMPILE](tpl, context, options) {
      let localHelpers = options.hbsHelper;
      if (localHelpers && typeof(localHelpers)=='object'){
        for (const key of Object.keys(localHelpers)) {
          handlebars.registerHelper(key, localHelpers[key]);
        }
      }
      return handlebars.compile(tpl, Object.assign({}, this.app.config.handlebars, options))(context);
    }
  }
  app.view.use('handlebars', HandlebarsView);
};

function loadPartial(app) {
  const partialsPath = app.config.handlebars.partialsPath;
  // istanbul ignore next
  if (!fs.existsSync(partialsPath)) return;

  const partials = {};
  const files = fs.readdirSync(partialsPath);
  for (let name of files) {
    const file = path.join(partialsPath, name);
    const stat = fs.statSync(file);
    if (!stat.isFile()) continue;

    name = name
      .replace(/\.\w+$/, '')
      .replace(/[_-][a-z]/ig, s => s.substring(1).toUpperCase());
    partials[name] = fs.readFileSync(file).toString();
  }
  return partials;
}


// TODO: 公共Helper加载
// function loadHelper(app) {
//   const helperPath = app.config.handlebars.helperPath;
//   // istanbul ignore next
//   if (!fs.existsSync(helperPath)) return;

//   const helpers = {};
//   // const files = fs.readdirSync(helperPath);
//   console.log("helperPath:", helperPath)
//   let tmp = require(helperPath);
//   // for (let name of files) {
//   //   const file = path.join(partialsPath, name);
//   //   const stat = fs.statSync(file);
//   //   if (!stat.isFile()) continue;

//   //   name = name
//   //     .replace(/\.\w+$/, '')
//   //     .replace(/[_-][a-z]/ig, s => s.substring(1).toUpperCase());
//   //     helpers[name] = fs.readFileSync(file).toString();
//   // }
//   return helpers;
// }
