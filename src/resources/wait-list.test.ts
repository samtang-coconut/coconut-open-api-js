import mockAxios from 'axios';

import Attendee from '../models/attendee';
import Preference from '../models/preference';
import WaitList from './wait-list';

it('will set location filter using a number', async () => {
  const resource = new WaitList(mockAxios);

  expect(resource.at(1)).toHaveProperty('relationships', {
    location: 1,
  });
});

it('will set location filter using a numeric string', async () => {
  const resource = new WaitList(mockAxios);

  expect(resource.at('1')).toHaveProperty('relationships', {
    location: '1',
  });
});

it('will set service filter using a number', async () => {
  const resource = new WaitList(mockAxios);

  expect(resource.seeking(1)).toHaveProperty('relationships', {
    service: 1,
  });
});

it('will set service filter using a numeric string', async () => {
  const resource = new WaitList(mockAxios);

  expect(resource.seeking('1')).toHaveProperty('relationships', {
    service: '1',
  });
});

it('will set user filter using a number', async () => {
  const resource = new WaitList(mockAxios);

  expect(resource.with(1)).toHaveProperty('relationships', {
    user: 1,
  });
});

it('will set user filter using a numeric string', async () => {
  const resource = new WaitList(mockAxios);

  expect(resource.with('1')).toHaveProperty('relationships', {
    user: '1',
  });
});

it('will set the client parameter using a number', async () => {
  const resource = new WaitList(mockAxios);

  expect(resource.belonging(1)).toHaveProperty('parameters', {
    client: 1,
  });
});

it('will set the client parameter using a numeric string', async () => {
  const resource = new WaitList(mockAxios);

  expect(resource.belonging('1')).toHaveProperty('parameters', {
    client: '1',
  });
});

it('will set the includes parameter using a comma separated string', async () => {
  const resource = new WaitList(mockAxios);

  expect(resource.include('relationships,go,here')).toHaveProperty('parameters', {
    include: 'relationships,go,here',
  });
});

it('can set additional details for the wait list request', async () => {
  const resource = new WaitList(mockAxios);

  expect(resource.provided('additional notes')).toHaveProperty('attributes', {
    notes: 'additional notes',
  });
});

it('can set an attendee for the wait list request', async () => {
  const resource = new WaitList(mockAxios);
  const attendee = new Attendee();

  expect(resource.for(attendee)).toHaveProperty('relationships', {
    attendee,
  });
});

it('can set a single preference for the wait list request', async () => {
  const resource = new WaitList(mockAxios);
  const preference = new Preference();

  expect(resource.prefers(preference)).toHaveProperty('relationships', {
    preferences: [preference],
  });
});

it('can set a multiple preferences for the wait list request', async () => {
  const resource = new WaitList(mockAxios);
  const preference = new Preference();

  expect(resource.prefers([preference, preference])).toHaveProperty('relationships', {
    preferences: [preference, preference],
  });
});

it('can create a new wait list request for a given client using only required attributes', async () => {
  const resource = new WaitList(mockAxios);
  const attendee = new Attendee();
  const preference = new Preference();

  await resource
    .for(attendee.named('Jane', 'Doe').reachable({ email: 'jane@doe.com' }))
    .at(1)
    .seeking(2)
    .prefers(preference.next())
    .add();

  expect(mockAxios.post).toHaveBeenCalledTimes(1);
  expect(mockAxios.post).toHaveBeenCalledWith('requests', {
    data: {
      attributes: {},
      relationships: {
        client: {
          data: {
            attributes: {
              email: 'jane@doe.com',
              first_name: 'Jane',
              last_name: 'Doe',
            },
            type: 'clients',
          },
        },
        location: {
          data: {
            id: '1',
            type: 'locations',
          },
        },
        preferences: {
          data: [
            {
              attributes: {
                start: Preference.now(),
                type: Preference.NEXT_AVAILABLE,
              },
              type: 'request-preferences',
            },
          ],
        },
        service: {
          data: {
            id: '2',
            type: 'services',
          },
        },
      },
      type: 'requests',
    },
  });
});

it('can create a new wait list request for a given client using all attributes', async () => {
  //
});

it('can retrieve a clients matching wait list request', async () => {
  const resource = new WaitList(mockAxios);

  await resource
    .belonging(1)
    .include('preferences')
    .find(2);

  expect(mockAxios.get).toHaveBeenCalledTimes(1);
  expect(mockAxios.get).toHaveBeenCalledWith('clients/1/requests/2', {
    params: {
      include: 'preferences',
    },
  });
});

it('can retrieve a clients matching wait list request without including preferences', async () => {
  const resource = new WaitList(mockAxios);

  await resource.belonging(1).find(2);

  expect(mockAxios.get).toHaveBeenCalledTimes(1);
  expect(mockAxios.get).toHaveBeenCalledWith('clients/1/requests/2', { params: {} });
});

it('can update a clients wait list request using only required attributes', async () => {
  //
});

it('can update a clients wait list request using all attributes', async () => {
  //
});

it('can delete a clients wait list request', async () => {
  const resource = new WaitList(mockAxios);

  await resource.belonging(1).remove(2);

  expect(mockAxios.delete).toHaveBeenCalledTimes(1);
  expect(mockAxios.delete).toHaveBeenCalledWith('clients/1/requests/2');
});
