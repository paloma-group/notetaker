import Image from 'next/image';
import loading from '../assets/loading.svg';

export default function Loading() {
  return (
    <div className={'absolute inset-0 grid place-items-center'}>
      <Image src={loading} alt={'Loading'} />
    </div>
  );
}
