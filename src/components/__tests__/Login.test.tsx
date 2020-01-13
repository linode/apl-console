import { mount } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'
import Login from '../Login'

it('Login snapshot matches old one', () => {
  const component = renderer.create(<Login />)
  const tree = component.toJSON()
  expect(tree).toMatchSnapshot()
})
it('Renders the login pane at /login', () => {
  const wrapper = mount(<Login />)
  expect(wrapper.find('input[name="email"]').length).toEqual(1)
  expect(wrapper.find('input[name="password"]').length).toEqual(1)
})
// it('Logs in with Google', () => {
//   const wrapper = mount(<Login />)
//   wrapper.find('button#loginWithGoogle').simulate('click')
// })
