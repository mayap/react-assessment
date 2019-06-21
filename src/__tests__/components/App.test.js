import App from '../../components/App';
import React from 'react';
import { shallow, mount } from 'enzyme';
import { create } from "react-test-renderer";
import NewsStory from '../../components/NewsStory';
import Search from '../../components/Search';

it('renders successfully', () => {
  shallow(<App />);
});

it('renders with children components', () => {
  const appWrapper = mount(<App />);

  expect(appWrapper.find(Search).length).toEqual(1);
  expect(appWrapper.find(NewsStory).length).toEqual(1);
});

it('renders (snapshot test)', () => {
  const component = create(<App />);

  expect(component.toJSON()).toMatchSnapshot();
});

it('has a function checkForSearchParams which returns default params object with initial state of the component', async () => {
  const component = shallow(<App />);
  const instance = component.instance();
  instance.loadData = jest.fn();
  instance.componentDidMount = jest.fn();

  component.update();

  const returnedParams = instance.checkForSearchParams();

  expect(returnedParams).toMatchObject({ page: 0 });
});

it('has a function checkForSearchParams which returns correct params object when state of the component is set', async () => {
  const component = shallow(<App />);
  const instance = component.instance();
  instance.loadData = jest.fn();
  instance.componentDidMount = jest.fn();
  instance.state = {
    activePage: 1,
    searchParams: {
      term: 'test',
      date: null
    }
  }

  component.update();

  const returnedParams = instance.checkForSearchParams();

  expect(returnedParams).toMatchObject({ page: 1, query: 'test' });
});

it('has a function componentDidMount which sets correct state when a response is received', async () => {
  const response = {
    data: {
      hits: [
        { id: 1 },
        { id: 2 },
        { id: 3 }
      ],
      hitsPerPage: 3,
      nbHits: 100
    }
  };
  const component = shallow(<App />);
  const instance = component.instance();
  instance.loadData = await jest.fn(() => response);

  const expectedState = {
    news: response.data.hits,
    itemsCountPerPage: response.data.hitsPerPage,
    totalItemsCount: response.data.nbHits
  }

  component.update();

  await instance.componentDidMount();

  expect(instance.state).toMatchObject(expectedState);
});
