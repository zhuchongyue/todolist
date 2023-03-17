
import React, { useState, useRef } from 'react'
import './CommentInput.scss';
import Mention from '@/components/Mention/Mention';
import { useAppSelector } from '@/store/hooks';
import { IUser, userSelector, usersSelector } from '@/store/user/userSlice';
import { Divider, Space, Tooltip, UploadFile as UploadFileType } from 'antd';
import { FileImageOutlined, LinkOutlined, SendOutlined } from '@ant-design/icons';
import CommentImg from './CommentImg';
import UploadFile from '../Upload/Upload';
import { curTaskSelector } from '@/store/task/taskSlice';
import { CommentContentType, createComment, ICreatedComment } from '@/api';

export default function CommentInput(props: {
  onSentComment: (comment: ICreatedComment) => void;
}) {

  const curTask = useAppSelector(curTaskSelector)
  const users = useAppSelector(usersSelector)
  const user = useAppSelector(userSelector)
  const inputRef = useRef<HTMLDivElement>(null)

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

    const nodes = Array.prototype.slice.call(inputRef.current!.childNodes)
    const textNodes = nodes.filter(n => n.nodeType === 3);
    textNodes.map(tn => tn.nodeValue = tn.nodeValue?.replace(`@${at.content}`, '') || '')

    // // @ts-ignore
    // anchorNode.nodeValue = '123'
    const mentionNode = document.createElement('em');
    mentionNode.dataset.id = member.id;
    mentionNode.textContent = `@${member.username} `;
    mentionNode.contentEditable = "false"
    inputRef.current!.appendChild(mentionNode);

    const spaceNode = document.createTextNode(' ');
    inputRef.current!.appendChild(spaceNode);

    resetAt()
  }

  const handleKeyup = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const selection = document.getSelection()
    anchorNode = selection?.anchorNode;

    if (e.key === 'Enter') {
      handleSendComment()
      // if (inputRef.current!.innerHTML === '') {
      //   return
      // }
      // inputRef.current!.innerHTML = '';
    } else if (e.key === '@') {
      // setOpenMention(true)
      openFlatAt()
    } else if (at.open) { //进入@文案提取
      const text = anchorNode?.nodeValue || '';

      // 如果是输入中文, 并且不是空格键, 忽略输入
      if (inputIME && text !== ' ') {
        return;
      }

      if (!/@/.test(text)) {
        resetFlagAt()
        return
      }

      if (e.key === ' ') { // 空格，退出@计算
        resetFlagAt()
        return
      }

      const matchAt = /@([^ ]*)/.exec(text);
      if (matchAt) {
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
      return undefined
    }).filter(n => !!n)

    return contents
  }

  const uploadImgBtnRef = React.createRef<HTMLDivElement>()
  const uploadFileBtnRef = React.createRef<HTMLSpanElement>()

  // const [fileList, setFileList] = useState<UploadFileType[]>([]);
  const [imgList, setImgList] = useState<UploadFileType[]>([]);
  const [attaches, setAttaches] = useState<UploadFileType[]>([]);

  // 发布后清空
  const clearContent = () => {
    inputRef.current!.innerHTML = '';
    setImgList([])
    setAttaches([])
  }

  const handleSendComment = () => {
    if (imgList.length == 0 && attaches.length === 0 && inputRef.current?.textContent?.length === 0) {
      return;
    }
    const inputContents = handleInputContent();
    const imgContents = imgList.map(img => {
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
      user: user.id,
      contents
    }
    // @ts-ignore
    createComment(comment).then(res => {
      if (res.data.id) {
        clearContent()
        // @ts-ignore
        props.onSentComment(Object.assign(comment, { id: res.data.id, user, createdAt: new Date().toString() }))
      }
    })
  }

  let inputIME = false; // 中文输入

  return (
    <div className='ci'>
      <Mention filter={at.content} members={users} open={at.open} onSelectedMember={handleSelectAtMember}>
        <div className='fake-input'></div>
      </Mention>
      <div
        ref={inputRef} className='ci-input'
        contentEditable placeholder="输入评论"
        onKeyUp={e => handleKeyup(e)}
        onCompositionStart={() => {
          inputIME = true;
        }}
        onCompositionEnd={() => {
          inputIME = false;
        }}
      >
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
              <FileImageOutlined style={{ fontSize: 20 }} onClick={() => {
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