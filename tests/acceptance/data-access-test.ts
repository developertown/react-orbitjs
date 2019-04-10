import { describe, it, beforeEach } from '@bigtest/mocha';
import { visit, location } from '@bigtest/react';
import { when } from '@bigtest/convergence';
import { expect } from 'chai';
import { setupApplicationTest } from 'tests/helpers';

import app from 'tests/helpers/pages/app';

describe('Acceptance | Basic Fetching', () => {
  setupApplicationTest();

  beforeEach(async function() {
    await visit('/');
  });

  it('visits the root route', () => {
    expect(location().pathname).to.equal('/');
  });

  it('shows the loader initially', () => {
    expect(app.pageText).to.not.include('fetch result');
    expect(app.pageText).to.include('Loading');
  });

  describe('data is finished loading', () => {
    // NOTE: the endpoint we were using (in application.tsx)
    //       is no longer active.
    //       need to find a public jsonapi for testing.
    //       maybe I should make one.
    // it('shows a list of ember versions', () => {
    //   expect(app.pageText).to.include('fetch result');
    // }).timeout(5000);
  });
});

describe('Acceptance | Errors', () => {
  setupApplicationTest();

  beforeEach(async function() {
    await visit('/deliberate-error');
  });

  it('renders an error', () => {
    expect(app.pageText).to.include('error');
  }).timeout(5000);
});
