import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link as RouterLink } from 'react-router-dom';
import request from '../../api/request';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select, TextareaAutosize } from '@mui/material';
// import { uploadFile } from '@/api/request';
import { upload, signup } from '@/api';
import { useNavigate } from 'react-router-dom';


function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="http://todolist.com/">
        http://todolist.com/
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// const theme = createTheme();

export default function SignUp() {
  const navigate = useNavigate()
  const [avatar, setAvatar] = useState('')
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const data = new FormData(event.currentTarget);
    console.log(data.values())
    console.log(data.entries())
    signup({
      username: data.get('username') as string,
      password: data.get('password') as string,
      bio: data.get('bio') as string,
      position: data.get('position') as string,
      avatar
    }).then(res => {
      if (res.data.id) {
        navigate('/signin')
      }
    })
    event.preventDefault();
  };


  const fileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]
    upload(e.target.files![0]).then(res => {
      console.log('res: ', res)
      setAvatar(res.data.url)
    })
  }

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  // autoComplete="given-name"
                  name="username"
                  required
                  fullWidth
                  id="username"
                  label="用户名"
                  autoFocus
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="密码"
                  type="password"
                  id="password"
                  // autoComplete="new-password"
                />
              </Grid>
              <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-helper-label">职位</InputLabel>
                <Select
                  labelId="demo-simple-select-helper-label"
                  id="demo-simple-select-helper"
                  label="职位"
                  fullWidth
                  name='position'
                >
                  <MenuItem value="CTO">CTO</MenuItem>
                  <MenuItem value={'CEO'}>CEO</MenuItem>
                  <MenuItem value={'UI'}>UI</MenuItem>
                  <MenuItem value={'Programmer'}>Programmer</MenuItem>
                  <MenuItem value={'PM'}>PM</MenuItem>
                </Select>
              </FormControl>
              </Grid>

              <Grid item xs={12}>
                {/* <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder="Minimum 3 rows"
                style={{ width: 200 }}
              /> */}
                <TextField
                  required
                  fullWidth
                  name="bio"
                  label="个人简介"
                  type="text"
                  id="bio"
                  autoComplete="bio"
                  placeholder='add a bio'
                />
              </Grid>
              <Grid item xs={12}>
                {
                  avatar
                    ? <div>
                      <Avatar src={avatar} sx={{ margin: '0 auto', width: 100, height: 100 }} />
                    </div>
                    : <Button fullWidth variant="contained" component="label">
                      Upload Your Avatar
                      <input onChange={fileChange} hidden accept="image/*" type="file" />
                    </Button>
                }

              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox defaultChecked value={true} color="primary" />}
                  label="I agree to join the todolist company."
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <RouterLink to="/signin">
                  <Link variant="body2">
                    Already have an account? Sign in
                  </Link>
                </RouterLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </>
  );
}