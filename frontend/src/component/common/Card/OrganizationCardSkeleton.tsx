import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Skeleton,
} from '@nextui-org/react';

function OrganizationCardSkeleton() {
  return (
    <Card className='max-w-[290px]'>
      <CardHeader className='justify-between'>
        <div className='flex gap-5'>
          <Skeleton className='rounded-full w-12 h-12' />
          <div className='flex flex-col gap-1 items-start justify-center'>
            <Skeleton className='h-5 w-20 rounded-md' />
          </div>
        </div>
        <Button
          color='primary'
          radius='full'
          size='sm'
          variant='solid'
        >
          Follow
        </Button>
      </CardHeader>
      <CardBody className='px-3 py-0 text-small text-default-400'>
        <Skeleton className='h-8' />
        <Skeleton className='h-4 mt-1' />
      </CardBody>
      <CardFooter className='gap-3'>
        <div className='flex gap-1'>
          <Skeleton className='font-semibold text-default-400 text-small w-20 h-8' />
        </div>
        <div className='flex gap-1'>
          <Skeleton className='font-semibold text-default-400 text-small w-20 h-8' />
        </div>
      </CardFooter>
    </Card>
  );
}

export default OrganizationCardSkeleton;
