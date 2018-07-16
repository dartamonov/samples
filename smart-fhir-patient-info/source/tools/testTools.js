import renderer from 'react-test-renderer';

export const takeSnapshot = x => renderer.create(x).toJSON();