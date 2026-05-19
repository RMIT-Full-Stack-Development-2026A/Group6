// Admin accounts are stored in the User collection with role='admin'
// Query admins with: User.find({ role: 'admin' })
export type { IUser as IAdmin } from './user.model';
export default null;