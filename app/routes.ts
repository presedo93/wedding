import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('auth/:action', 'routes/auth.ts'),
  route('profile', 'routes/profile/home.tsx', [
    index('routes/profile/guests.tsx'),
    route('new-guest', 'routes/profile/new-guest.tsx'),
    route('confirm-guests', 'routes/profile/confirm-guests.tsx'),
    route('delete-guest', 'routes/profile/delete.tsx'),
    route('edit-tasks', 'routes/profile/edit-tasks.tsx'),
  ]),
  route('music', 'routes/music/home.tsx', [
    route('grant-access', 'routes/music/grant-access.tsx'),
    route('handle-song', 'routes/music/handle-song.tsx'),
  ]),
  route('chat', 'routes/chat/home.tsx', [
    route('handle-message', 'routes/chat/handle-message.tsx'),
  ]),
  route('photo', 'routes/photo/home.tsx'),
  route('admin', 'routes/admin/home.tsx'),
  route('best-man', 'routes/special/best-man.tsx'),
] satisfies RouteConfig
