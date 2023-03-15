
import React, { useState, useRef, useEffect } from 'react'
import './CommentInput.scss';
import Mention from '@/components/Mention/Mention';
import { useAppSelector } from '@/store/hooks';
import { IUser, userSelector, usersSelector } from '@/store/user/userSlice';
import { Button, Divider, Space, Tooltip, UploadFile as UploadFileType } from 'antd';
import { FileImageOutlined, LinkOutlined, SendOutlined } from '@ant-design/icons';
import CommentImg from './CommentImg';
import UploadFile from '../Upload/Upload';
import { curTaskSelector } from '@/store/task/taskSlice';
import { CommentContentType, createComment } from '@/api';

export default function CommentInput() {

  const curTask = useAppSelector(curTaskSelector)
  const users = useAppSelector(usersSelector)
  const userId = useAppSelector(userSelector).id!
  const inputRef = useRef<HTMLDivElement>(null)
  // const [openMention, setOpenMention] = useState(false)

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    debugger
    console.log(e.target)
  }


  let anchorNode: Node | null | undefined; // 当前的光标 所在的TextNode 

  const [at, setAt] = useState<{ open: boolean; content: string }>({
    open: false,
    content: ''
  })

  const openFlatAt = (content?: string) => {
    setAt({
      open: true,
      content: content ? content : '',
    })
  }
  // 仅重置at flag信息
  const resetFlagAt = (username?: string) => {
    // const cache = username ? [username] : [...at.cache]
    setAt({
      open: false,
      content: '',
    })
  }

  // 完全重置 at 相关计算，1、Enter 发送一次聊天，2. 切换当前聊天对象
  const resetAt = () => setAt({
    open: false,
    content: '',
  })

  const handleSelectAtMember = (member: IUser) => {

    const selection = document.getSelection()
    console.log('handleSelectAtMember anchorNode: ', selection?.anchorNode)

    const nodes = Array.prototype.slice.call(inputRef.current!.childNodes)
    const textNodes = nodes.filter(n => n.nodeType === 3);
    textNodes.map(tn => tn.nodeValue = tn.nodeValue?.replace(`@${at.content}`, '') || '')

    // console.log('handleSelectAtMember: ', anchorNode)
    // // @ts-ignore
    // anchorNode.nodeValue = '123'
    const mentionNode = document.createElement('em');
    mentionNode.dataset.id = member.id;
    mentionNode.textContent = `@${member.username} `;
    mentionNode.contentEditable = "false"
    inputRef.current!.appendChild(mentionNode);

    const spaceNode = document.createTextNode(' ');
    inputRef.current!.appendChild(spaceNode);

    // inputRef.current?.focus();

    // var range = window.getSelection(); //创建range
    //         range?.selectAllChildren(inputRef.current!); //range 选择obj下所有子内容
    //         range?.collapseToEnd(); //光标
    resetAt()
    // inputRef.current?.focus()

    // const username = member.username
    // const newMsg = msg.substring(0, inputIndex) + `${username} ` + msg.substring(inputIndex + `@${at.content}`.length)
    // // setMsg(msg.replace(`@${at.content}`, `@${username} `))
    // setMsg(newMsg)
    // resetFlagAt(username)

    // textAreaRef.current?.focus()
  }

  const handleKeyup = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // console.log('inputRef.current?.selectionStart: ', inputRef.current?.onselectstart)
    // console.log(document.getSelection())
    const selection = document.getSelection()
    anchorNode = selection?.anchorNode;
    // console.log('handleKeyup anchorNode: ', anchorNode)
    // if (anchorNode) {
    //   anchorNode.nodeValue = anchorNode.nodeValue!.replace('L', '0')
    // }


    if (e.key === 'Enter') {
      if (inputRef.current!.innerHTML === '') {
        return
      }
      inputRef.current!.innerHTML = '';
    } else if (e.key === '@') {
      // setOpenMention(true)
      openFlatAt()
    } else if (at.open) { //进入@文案提取
      const text = anchorNode?.nodeValue || '';

      if (!/@/.test(text)) {
        resetFlagAt()
        return
      }

      if (e.key === ' ') { // 空格，退出@计算
        console.log('空格，退出@计算 ')
        resetFlagAt()
        return
      }

      const matchAt = /@([^ ]*)/.exec(text);
      if (matchAt) {
        // const cache = [...at.cache]
        setAt({ open: true, content: matchAt[1] })
      }
    }
  }

  const handleInputContent = () => {
    const nodes = Array.prototype.slice.call(inputRef.current!.childNodes);
    const contents = nodes.map(n => {
      if (n.nodeType === 3 && !!String(n.nodeValue).trim()) {
        return ({
          type: CommentContentType.TEXT,
          content: n.nodeValue
        })
      }

      if (n.nodeType === 1 && n.nodeName === 'EM') {
        return ({
          type: CommentContentType.MENTION,
          content: n.innerText as string,
          mentionId: n.dataset.id!
        })
      }
    }).filter(n => !!n)

    return contents
  }

  const uploadImgBtnRef = React.createRef<HTMLDivElement>()
  const uploadFileBtnRef = React.createRef<HTMLSpanElement>()

  // const [fileList, setFileList] = useState<UploadFileType[]>([]);
  const [imgList, setImgList] = useState<UploadFileType[]>([]);
  const [attaches, setAttaches] = useState<UploadFileType[]>([]);

  const handleSendComment = () => {

    const inputContents = handleInputContent();
    const imgContents = imgList.map(img  => {
      debugger
      return ({
        type: CommentContentType.IMG,
        content: img.response!.url! as string,
      })
    });
    const fileContents = attaches.map(file => {
      return ({
        type: CommentContentType.FILE,
        content: file.response!.url! as string
      })
    });

    const contents = [...inputContents, ...imgContents, ...fileContents]
    const comment = {
      task: curTask!.id,
      user: userId,
      contents
    }
    // @ts-ignore
    createComment(comment)
  }

  // useEffect(() => {
  //   const cnode = document.createElement('i')
  //   cnode.innerText = 'abcdefg'
  //   inputRef.current?.append(cnode)
  // }, [])
  

  return (
    <div className='ci'>
      {/* <Button onClick={() => setOpenMention(true)}>open</Button>  openChange={open => setOpenMention(open)}  */}
      <Mention filter={at.content} members={users} open={at.open} onSelectedMember={handleSelectAtMember}>
        <div className='fake-input'></div>
      </Mention>
      <div
        ref={inputRef} className='ci-input'
        contentEditable placeholder="输入评论"
        // onInput={(e) => handleInput(e)}
        onKeyUp={e => handleKeyup(e)}
      >
        {/* <span contentEditable="false">default</span> */}
      </div>
      <div className='ci-files'>
        {/* @ts-ignore */}
        <CommentImg imgList={imgList} onChange={imgList => setImgList(imgList)} ref={uploadImgBtnRef} />
        {/* @ts-ignore */}
        <UploadFile fileList={attaches} onChange={(fileList) => setAttaches(fileList)}><span ref={uploadFileBtnRef}></span></UploadFile>
      </div>
      <div className='ci-action'>
        <Space split={<Divider type="vertical" />}>
          <Space>
            <Tooltip title="上传图片">
            <FileImageOutlined style={{ fontSize: 20 }} onClick={() =>  {
              if (uploadImgBtnRef.current) {
                uploadImgBtnRef.current.click()
              }
            }} />
            </Tooltip>
            <Tooltip title="添加附件">
              <LinkOutlined style={{ fontSize: 20 }} onClick={() => {
                if (uploadFileBtnRef.current) {
                  uploadFileBtnRef.current.click()
                }
              }} />
            </Tooltip>
          </Space>
          <SendOutlined onClick={() => handleSendComment()} style={{ fontSize: 20, color: '#1677ff' }} />
        </Space>
      </div>
    </div>
  )
}