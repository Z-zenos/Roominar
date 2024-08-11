import MenuIcon from '@mui/icons-material/Menu';
import MoreIcon from '@mui/icons-material/MoreVert';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import CameraIcon from '../../../public/icons/camera_icon.svg';
import CardIcon from '../../../public/icons/card_icon.svg';
import Logo from '../../../public/logo/ZollImage.svg';

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static' sx={{ bgcolor: 'white', height: '64px', boxShadow: 'none' }}>
        <div className='flex justify-between items-center px-4'>
          <div className='flex justify-start items-center'>
            <Toolbar>
              <IconButton size='large' edge='start' aria-label='menu'>
                <MenuIcon sx={{ width: '40px', height: '40px' }} />
              </IconButton>
            </Toolbar>
            <Logo />
          </div>
          <div className='flex justify-end items-center gap-6'>
            <div className='flex justify-end items-center gap-1'>
              <CameraIcon className='text-black/55' />
              <span className='text-sm font-medium text-black/55'>OCR</span>
            </div>
            <div className='flex justify-end items-center gap-1'>
              <CardIcon className='text-black/55' />
              <span className='text-sm font-medium text-black/85'>TCCC Card</span>
            </div>
            <IconButton edge='end' sx={{ padding: '0px' }}>
              <MoreIcon />
            </IconButton>
          </div>
        </div>
      </AppBar>
    </Box>
  );
}
