import type { Meta, StoryObj } from '@storybook/react'
import { SimpleForm } from './SimpleForm'

const meta: Meta<typeof SimpleForm> = {
  title: 'Forms/SimpleForm',
  component: SimpleForm,
}
export default meta

type Story = StoryObj<typeof SimpleForm>

export const Default: Story = {
  render: () => <SimpleForm />,
}


