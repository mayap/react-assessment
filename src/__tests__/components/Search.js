import React from 'react';
import { shallow } from 'enzyme';
import { create } from "react-test-renderer";
import Search from '../../components/Search';

it('renders successfully', () => {
  shallow(<Search />);
});

it('renders (snapshot test)', () => {
  const component = create(<Search />);

  expect(component.toJSON()).toMatchSnapshot();
});
