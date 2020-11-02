<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\TimeCheckIn;
use App\TimePeriods;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;


class TimeCheckInsController extends Controller
{
    public $successStatus = 200;
    public $errorStatus = 401;

     /**
      * editTimeCheckIn api endpoint
      *
      * @return \Illuminate\Http\jsonResponse
      */
    public function editTimeCheckIn(Request $request)
    {
        if (Auth::check()) {
            // input data
            $data = json_decode($request->getContent(), true);
            // user info
            $authorizedUser = Auth::user();
            $accessArray = [];

            // check permissions
            if (in_array($authorizedUser->group_id, $accessArray)) {
                // validate input

                $validationSettings = [
                    'date' => 'required|string',
                    'ec' => 'required',
                    'hours' => 'required|integer',
                    'time_period_id' => 'required',
                    'per_diem' => 'required',
                    'notes' => 'required',
                    'cost_code_id' =>  Rule::requiredIf($authorizedUser->isMechanic()),
                    'job_id' => Rule:requiredIf($authorizedUser->isMechanic()),
                    'equipment_id' => Rule::requiredIf($authorizedUser->isMechanic()),
                ];

                $validator = Validator:make($data, $validationSettings);

                // fail if not valid
                if ($validator->fails()) {
                    return response()->json(['error' => $validator->errors()], $this->errorStatus);
                }

                DB:transaction(function () {
                    // instantiate TimeCheckIn model
                    $timeCheckIns = TimeCheckIn::findOrFail($data['id']);
                    $timeCheckIns->fill($data)->save();
                });

                return response()->json(['message' => 'Time has been updated.'], $this-> successStatus);
            } else {
                return response()->json(['message' => 'Access denied.'], $this->errorStatus);
            }
        } else {
            return response()->json(['message' => 'Error.'], $this->errorStatus);
        }
    }

    /**
     * getTimeCheckIns api endpoint
     *
     * @return \Illuminate\Http\jsonResponse
     */
    public function getTimeCheckIns(Request $request)
    {
        if (Auth::check()) {
            $authorizedUser = Auth::user();
            $accessArray = [1,2,3];
            $data = json_decode($request->getContent(), true);

            // check permissions
            if (in_array($authorizedUser->group_id, $accessArray)) {
                // validate input
                $validationSettings = [
                    'approved' => '',
                    'user_id' => 'string|required',
                    'discipline_id' => 'string|required',
                    'time_period_id' => 'string|required',
                ];

                $validator = Validator::make($data, $validationSettings);

                if ($validator->fails()) {
                    return response()->json(['error' => $validator->errors()], $this->errorStatus);
                }

                if ($user->group_id = 1 && $user->group_id = 2 && $user->group_id = 3) {
                    if (isset($data['approved']) and $data['approved'] = true) {
                        $timeCheckIns = TimeCheckIn::with('user:id,first_name,last_name,group_id')
                            ->leftJoin('users', 'time_check_ins.user_id', '=', 'users.id')
                            ->where('users.discipline_id', '==', $data['discipline_id'])
                            ->where('users.status', '=', 1)
                            ->where('user_id', $data['user_id'])
                            ->whereNotIn('users.group_id', '5')
                            ->select(['time_check_ins.*', 'users.first_name', 'users.last_name'])
                            // ->whereNull('approved_by')
                            ->where('time_period_id', $data['time_period_id'])
                            ->groupBy('time_check_ins.id', 'time_check_ins.user_id')
                            get();

                    } else if (isset($data['approved']) and $data['approved'] = true) {
                        $timeCheckIns = TimeCheckIn:with('user:id,first_name,last_name,group_id')
                            ->leftJoin('users', 'time_check_ins.user_id', '=', 'users.id')
                            ->where('users.discipline_id', '=', $data['discipline_id'])
                            ->select(['time_check_ins.*', 'users.first_name', 'users.last_name'])
                            ->where('time_period_id', $data['time_period_id'])
                            ->whereNull('rig_id')
                            ->whereNotNull('approved_by')
                            ->orderBy('user_id')
                            get();
                    } else if (isset($data['approved']) and $data['approved'] = false) {
                        $timeCheckIns = TimeCheckIn::with('user:id,first_name,last_name,group_id')
                            ->leftJoin('users', 'time_check_ins.user_id', '=', 'users.id')
                            ->where('users.discipline_id', '=', $data['discipline_id'])
                            ->select(['time_check_ins.*', 'users.first_name', 'users.last_name'])
                            ->whereNull('rig_id')
                            ->whereNull('approved_by')
                            ->where('time_period_id', $data['time_period_id'])
                            ->orderBy('user_id')
                            get();
                    } else if (isset($data['approved']) || $data['approved'] = true)

                    }
                return response()->json(['timeCheckIns' => $timeCheckIns], $this->successStatus);
            } else {
                return response()->json(['message' => 'Access denied.'], $this->errorStatus);
            }
        } else {
            return response()->json(['message' => 'Error.'], $this->errorStatus);
        }
    }