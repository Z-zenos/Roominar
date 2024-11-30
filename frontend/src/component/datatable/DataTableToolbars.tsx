// import clsx from 'clsx';
// import { FormInput } from '../form/Form';

// export default function DataTableToolbar() {
//   return (
//     <div className='flex flex-col gap-4'>
//       <div className='flex justify-between gap-3 items-end'>
//         <FormInput
//           id='newEmail'
//           name='newEmail'
//           label='newEmail'
//           required
//           placeholder='newemail@gmail.com'
//           className={clsx(
//             status === 'authenticated' && 'bg-slate-100 text-gray-500',
//           )}
//           type='email'
//           // control={form.control}
//           // showError={
//           //   form.formState.errors.newEmail &&
//           //   form.formState.touchedFields.newEmail &&
//           //   true
//           // }
//         />
//         <div className='flex gap-3'>
//           <Dropdown>
//             <DropdownTrigger className='hidden sm:flex'>
//               <Button
//                 endContent={<ChevronDownIcon className='text-small' />}
//                 variant='flat'
//               >
//                 Status
//               </Button>
//             </DropdownTrigger>
//             <DropdownMenu
//               disallowEmptySelection
//               aria-label='Table Columns'
//               closeOnSelect={false}
//               selectedKeys={statusFilter}
//               selectionMode='multiple'
//               onSelectionChange={setStatusFilter}
//             >
//               {statusOptions.map((status) => (
//                 <DropdownItem
//                   key={status.uid}
//                   className='capitalize'
//                 >
//                   {capitalize(status.name)}
//                 </DropdownItem>
//               ))}
//             </DropdownMenu>
//           </Dropdown>
//           <Dropdown>
//             <DropdownTrigger className='hidden sm:flex'>
//               <Button
//                 endContent={<ChevronDownIcon className='text-small' />}
//                 variant='flat'
//               >
//                 Columns
//               </Button>
//             </DropdownTrigger>
//             <DropdownMenu
//               disallowEmptySelection
//               aria-label='Table Columns'
//               closeOnSelect={false}
//               selectedKeys={visibleColumns}
//               selectionMode='multiple'
//               onSelectionChange={setVisibleColumns}
//             >
//               {columns.map((column) => (
//                 <DropdownItem
//                   key={column.uid}
//                   className='capitalize'
//                 >
//                   {capitalize(column.name)}
//                 </DropdownItem>
//               ))}
//             </DropdownMenu>
//           </Dropdown>
//           <Button
//             color='primary'
//             endContent={<PlusIcon />}
//           >
//             Add New
//           </Button>
//         </div>
//       </div>
//       <div className='flex justify-between items-center'>
//         <span className='text-default-400 text-small'>
//           Total {users.length} users
//         </span>
//         <label className='flex items-center text-default-400 text-small'>
//           Rows per page:
//           <select
//             className='bg-transparent outline-none text-default-400 text-small'
//             onChange={onRowsPerPageChange}
//           >
//             <option value='5'>5</option>
//             <option value='10'>10</option>
//             <option value='15'>15</option>
//           </select>
//         </label>
//       </div>
//     </div>
//   );
// }
