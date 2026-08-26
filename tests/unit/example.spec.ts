import { mount } from '@vue/test-utils';
import LoginPage from '@/views/LoginPage.vue';
import { describe, expect, test } from 'vitest';

describe('LoginPage.vue', () => {
  test('renders the Albumfy login screen', () => {
    const wrapper = mount(LoginPage);
    expect(wrapper.text()).toContain('Albumfy');
  });
});
