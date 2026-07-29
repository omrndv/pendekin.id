<?php

namespace App\Enums;

enum ReportStatus: string
{
    case PENDING = 'pending';
    case RESOLVED = 'resolved';
    case DISMISSED = 'dismissed';
    case APPROVED = 'approved';
    case REJECTED = 'rejected';
}
