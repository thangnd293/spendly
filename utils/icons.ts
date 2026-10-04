const icons = require.context('../assets/images/icons', false, /\.png$/);
const iconKeys = icons.keys();

function iconSource(name: string) {
  if (name.startsWith('./')) return icons(name);

  return icons(`./${name}`);
}

function fileName(key: string) {
  return key.replace(/.\//, '');
}

function iconName(key: string) {
  return key.replace(/.\//, '').split('.')[0];
}

export { iconSource, iconName, fileName, iconKeys };
