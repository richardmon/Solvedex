import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react';
import jestFetch from "jest-fetch-mock";

jestFetch.dontMock();

afterEach(() => {
  cleanup();
  // nock.cleanAll();
});
