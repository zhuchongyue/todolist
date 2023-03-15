import { CommentContentType, ICreateComment, ICreatedComment } from "@/api";
import { IUser } from "@/store/user/userSlice";
import { Avatar, Image, List, Space, UploadFile } from "antd";
import { Divider, Typography } from 'antd';
import UploadFileList  from '@/components/Upload/Upload';
import "./CommentList.scss"

const { Title, Paragraph, Text, Link } = Typography;

export default function CommentList(props: {
  data: Array<ICreatedComment>;
}) {
  return (
    <List
      className="cl"
      split={false}
      dataSource={props.data}
      rowKey="id"
      locale={{emptyText: '暂无评论'}}
      renderItem={(comment, index) => {

        let commentText: string[] = [];
        let imgList: string[] = [];
        let fileList: UploadFile[] = []
        comment.contents.forEach(citem => {
          if (citem.type === CommentContentType.TEXT) {
            commentText.push(citem.content)
          }
          if (citem.type === CommentContentType.MENTION) {
            commentText.push(`<em>${citem.content}</em>`)
          }

          if (citem.type === CommentContentType.IMG) {
            imgList.push(citem.content)
          }

          if (citem.type === CommentContentType.FILE) {
            const name = citem.content.split('/').pop();
            const file = {
              status: 'done',
              name: name!,
              uid: name!,
              url: citem.content,
              thumbUrl: citem.content
            };
            // @ts-ignore
            fileList.push(file);
          }
        });
        return (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src={comment.user.avatar || ''} />}
            title={<a href="https://ant.design">{comment.user.username}</a>}
            description={
              <Space direction='vertical'>
                <div className="cl-content" dangerouslySetInnerHTML={{__html: commentText.join('')}}></div>
                <Space size={'small'}>
                {
                  imgList.map(url => (
                    <Image width={80} height={80} src={url} />
                  ))
                }
                </Space>
                <UploadFileList fileList={fileList} readonly>
                </UploadFileList>
              </Space>
            }
          />
        </List.Item>
        )
      }
      }
    />
  )
}