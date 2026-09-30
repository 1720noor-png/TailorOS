<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use App\Models\SavedResult;
use Illuminate\Http\Request;

class UserDashboardController extends Controller
{
    public function getFavorites(Request $request)
    {
        $favorites = Favorite::where('user_id', $request->user()->id)
            ->latest()
            ->pluck('tool_slug');

        return response()->json([
            'status' => 'success',
            'favorites' => $favorites,
        ]);
    }

    public function toggleFavorite(Request $request)
    {
        $validated = $request->validate([
            'tool_slug' => 'required|string',
        ]);

        $user = $request->user();
        $fav = Favorite::where('user_id', $user->id)->where('tool_slug', $validated['tool_slug'])->first();

        if ($fav) {
            $fav->delete();
            return response()->json([
                'status' => 'success',
                'is_favorite' => false,
                'message' => 'Removed from favorites',
            ]);
        } else {
            Favorite::create([
                'user_id' => $user->id,
                'tool_slug' => $validated['tool_slug'],
            ]);
            return response()->json([
                'status' => 'success',
                'is_favorite' => true,
                'message' => 'Added to favorites',
            ]);
        }
    }

    public function getSavedResults(Request $request)
    {
        $results = SavedResult::where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'status' => 'success',
            'results' => $results,
        ]);
    }

    public function saveResult(Request $request)
    {
        $validated = $request->validate([
            'tool_slug' => 'required|string',
            'title' => 'required|string|max:255',
            'payload' => 'required|string',
        ]);

        $saved = SavedResult::create([
            'user_id' => $request->user()->id,
            'tool_slug' => $validated['tool_slug'],
            'title' => $validated['title'],
            'payload' => $validated['payload'],
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Result saved successfully',
            'result' => $saved,
        ], 201);
    }

    public function deleteResult(Request $request, $id)
    {
        $saved = SavedResult::where('user_id', $request->user()->id)->where('id', $id)->first();
        if ($saved) {
            $saved->delete();
            return response()->json(['status' => 'success', 'message' => 'Result deleted.']);
        }

        return response()->json(['status' => 'error', 'message' => 'Not found.'], 404);
    }
}
