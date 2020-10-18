import React, { Fragment } from 'react';
import BlockUi from './molecules/BlockUi';
import Toast from './molecules/Toast';
import AnnouncementDialog from './organisms/AnnouncementDialog';
import BaseSelectDialog from './organisms/BaseSelectDialog';
import CreateActions from './organisms/CreateActions';
import CreateMapDialog from './organisms/CreateMapDialog';
import DeleteCommentDialog from './organisms/DeleteCommentDialog';
import DeleteReviewDialog from './organisms/DeleteReviewDialog';
import EditMapDialog from './organisms/EditMapDialog';
import EditProfileDialog from './organisms/EditProfileDialog';
import EditReviewDialog from './organisms/EditReviewDialog';
import FeedbackDialog from './organisms/FeedbackDialog';
import FollowersDialog from './organisms/FollowersDialog';
import FollowingMapsDialog from './organisms/FollowingMapsDialog';
import ImageDialog from './organisms/ImageDialog';
import IssueDialog from './organisms/IssueDialog';
import LeaveMapDialog from './organisms/LeaveMapDialog';
import LikesDialog from './organisms/LikesDialog';
import PlaceSelectDialog from './organisms/PlaceSelectDialog';
import ReviewDialog from './organisms/ReviewDialog';
import SearchMapsDialog from './organisms/SearchMapsDialog';
import SignInRequiredDialog from './organisms/SignInRequiredDialog';
import SpotDialog from './organisms/SpotDialog';

const SharedDialogs = () => {
  return (
    <Fragment>
      <Toast />
      <BlockUi />
      <FeedbackDialog />
      <AnnouncementDialog />
      <SignInRequiredDialog />
      <IssueDialog />
      <LikesDialog />
      <FollowersDialog />
      <PlaceSelectDialog />
      <BaseSelectDialog />
      <EditReviewDialog />
      <DeleteReviewDialog />
      <DeleteCommentDialog />
      <ReviewDialog />
      <ImageDialog />
      <SpotDialog />
      <CreateMapDialog />
      <EditMapDialog />
      <EditProfileDialog />
      <SearchMapsDialog />
      <CreateActions />
      <FollowingMapsDialog />
      <LeaveMapDialog />
    </Fragment>
  );
};
export default SharedDialogs;
