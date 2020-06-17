import React from 'react'
import { shallow } from 'enzyme'
import App from '../../App'

it('renders without crashing. Awesome.', () => {
  const wrapper = shallow(<App />)
  const welcome = <h2>Welcome to React</h2>
  it('renders without exploding', () => {
    expect(wrapper.contains(welcome)).toEqual(true)
  })
})
