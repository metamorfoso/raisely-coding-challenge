import * as React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event';
import { waitForElementToBeRemoved, within } from "@testing-library/dom";

import { tags, users } from './api'

import { UserTags } from './Tags'

const user = users[0]

beforeEach(() => {
  render(<UserTags user={user} />)
})

it('renders heading', async () => {
  expect(await screen.findByRole('heading')).toHaveTextContent('Tags')
})

it('renders tags already assigned to the user', async () => {
  const initialUserTag = await screen.findByText('Donor')

  expect(initialUserTag).toBeInTheDocument()
})

it('allows user to assign an existing tag', async () => {
  const tagToAdd = tags[1].title // already exists in mocked tags, but is not assigned to the user

  const heading = await screen.findByRole('heading')
  const outer = heading.parentElement

  await userEvent.hover(outer)

  const addButton = await screen.findByRole('button', { name: 'Add new tag' })
  await userEvent.click(addButton)

  const input = await screen.findByRole('textbox', { name: 'Enter a tag name to look up or create' })
  await userEvent.type(input, tagToAdd)

  const addExistingTagButton = await screen.findByRole('button', { name: tagToAdd })
  await userEvent.click(addExistingTagButton)

  const tagList = await screen.findByRole('list')
  const addedTag = await within(tagList).findByText(tagToAdd)

  expect(addedTag).toBeInTheDocument()
})

it('allows user to create and assign a new tag', async () => {
  const tagToAdd = 'Organiser' // does not exist in mocked tags (and is not assigned to the user)

  const heading = await screen.findByRole('heading')
  const outer = heading.parentElement

  await userEvent.hover(outer)

  const addButton = await screen.findByRole('button', { name: 'Add new tag' })
  await userEvent.click(addButton)

  const input = await screen.findByRole('textbox', { name: 'Enter a tag name to look up or create' })
  await userEvent.type(input, tagToAdd)

  const createNewTagButton = await screen.findByRole('button', { name: 'Create tag' })
  await userEvent.click(createNewTagButton)

  const tagList = await screen.findByRole('list')
  const addedTag = await within(tagList).findByText(tagToAdd)

  expect(addedTag).toBeInTheDocument()
})

it('allows user to unassign a tag', async () => {
  const tagToUnassign = tags[1].title // assigned to the user in mocked data

  const tagList = await screen.findByRole('list')

  const targetTag = await within(tagList).findByText(tagToUnassign)
  await userEvent.hover(targetTag)

  const removeButton = await screen.findByRole('button', { name: `Unassign tag ${tagToUnassign}` })
  await userEvent.click(removeButton)

  await waitForElementToBeRemoved(targetTag)

  expect(within(tagList).queryByText(tagToUnassign)).not.toBeInTheDocument()
})