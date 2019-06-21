import React from 'react';
import { shallow } from 'enzyme';
import { create } from "react-test-renderer";
import NewsStory from '../../components/NewsStory';

const mockedNews = [
  {
    objectID: "1",
    created_at: "2019-06-21T13:59:28.000Z",
    created_at_i: 1561125568,
    title: 'Test 1',
    url: 'url',
    author: 'author',
    _tags: [
      'test'
    ]
  }
];

it('renders successfully', () => {
  shallow(<NewsStory news={mockedNews} />);
});

it('renders (snapshot test)', () => {
  const component = create(<NewsStory news={mockedNews} />);

  expect(component.toJSON()).toMatchSnapshot();
});
