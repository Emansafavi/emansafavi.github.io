<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Simple authentication (you should implement proper authentication)
$admin_password = 'admin123'; // Change this to match your admin.js password

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($input['password']) || $input['password'] !== $admin_password) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit;
    }
    
    $action = $input['action'] ?? '';
    $base_path = '../'; // Path to your Jekyll site root
    
    switch ($action) {
        case 'save_post':
            $title = $input['title'] ?? '';
            $content = $input['content'] ?? '';
            $date = date('Y-m-d');
            $filename = $date . '-' . strtolower(preg_replace('/[^a-zA-Z0-9]/', '-', $title)) . '.md';
            $filepath = $base_path . '_posts/' . $filename;
            
            $post_content = "---\n";
            $post_content .= "layout: post\n";
            $post_content .= "title: \"$title\"\n";
            $post_content .= "date: $date\n";
            $post_content .= "categories: [General]\n";
            $post_content .= "excerpt: \"Auto-generated excerpt\"\n";
            $post_content .= "---\n\n";
            $post_content .= $content;
            
            if (file_put_contents($filepath, $post_content)) {
                echo json_encode(['success' => true, 'filename' => $filename]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to save post']);
            }
            break;
            
        case 'save_project':
            $title = $input['title'] ?? '';
            $description = $input['description'] ?? '';
            $content = $input['content'] ?? '';
            $thumbnail = $input['thumbnail'] ?? '';
            $categories = $input['categories'] ?? '';
            $filename = strtolower(preg_replace('/[^a-zA-Z0-9]/', '-', $title)) . '.md';
            $filepath = $base_path . $filename;
            
            $project_content = "---\n";
            $project_content .= "layout: empty\n";
            $project_content .= "title: \"$title\"\n";
            $project_content .= "permalink: /" . strtolower(preg_replace('/[^a-zA-Z0-9]/', '-', $title)) . "/\n";
            $project_content .= "description: \"$description\"\n";
            $project_content .= "thumbnail: \"$thumbnail\"\n";
            $project_content .= "categories: [$categories]\n";
            $project_content .= "---\n\n";
            $project_content .= $content;
            
            if (file_put_contents($filepath, $project_content)) {
                echo json_encode(['success' => true, 'filename' => $filename]);
            } else {
                http_response_code(500);
                echo json_encode(['error' => 'Failed to save project']);
            }
            break;
            
        case 'upload_media':
            if (isset($_FILES['file'])) {
                $file = $_FILES['file'];
                $alt = $_POST['alt'] ?? '';
                
                $upload_dir = $base_path . 'assets/images/';
                $filename = time() . '_' . $file['name'];
                $filepath = $upload_dir . $filename;
                
                if (move_uploaded_file($file['tmp_name'], $filepath)) {
                    echo json_encode([
                        'success' => true, 
                        'filename' => $filename,
                        'url' => '/assets/images/' . $filename,
                        'alt' => $alt
                    ]);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Failed to upload file']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'No file uploaded']);
            }
            break;
            
        case 'list_posts':
            $posts_dir = $base_path . '_posts/';
            $posts = [];
            
            if (is_dir($posts_dir)) {
                $files = glob($posts_dir . '*.md');
                foreach ($files as $file) {
                    $content = file_get_contents($file);
                    $filename = basename($file);
                    
                    // Extract front matter
                    if (preg_match('/---\s*\n(.*?)\n---\s*\n(.*)/s', $content, $matches)) {
                        $front_matter = $matches[1];
                        $body = $matches[2];
                        
                        // Parse title
                        if (preg_match('/title:\s*"([^"]+)"/', $front_matter, $title_match)) {
                            $title = $title_match[1];
                        } else {
                            $title = $filename;
                        }
                        
                        // Parse date
                        if (preg_match('/date:\s*(\d{4}-\d{2}-\d{2})/', $front_matter, $date_match)) {
                            $date = $date_match[1];
                        } else {
                            $date = date('Y-m-d', filemtime($file));
                        }
                        
                        $posts[] = [
                            'filename' => $filename,
                            'title' => $title,
                            'date' => $date,
                            'content' => $body
                        ];
                    }
                }
            }
            
            echo json_encode(['posts' => $posts]);
            break;
            
        case 'list_projects':
            $projects = [];
            $files = glob($base_path . '*.md');
            
            foreach ($files as $file) {
                $filename = basename($file);
                if ($filename !== 'README.md' && $filename !== 'index.md') {
                    $content = file_get_contents($file);
                    
                    if (preg_match('/---\s*\n(.*?)\n---\s*\n(.*)/s', $content, $matches)) {
                        $front_matter = $matches[1];
                        $body = $matches[2];
                        
                        if (preg_match('/title:\s*"([^"]+)"/', $front_matter, $title_match)) {
                            $title = $title_match[1];
                        } else {
                            $title = $filename;
                        }
                        
                        if (preg_match('/description:\s*"([^"]+)"/', $front_matter, $desc_match)) {
                            $description = $desc_match[1];
                        } else {
                            $description = '';
                        }
                        
                        if (preg_match('/categories:\s*\[(.*?)\]/', $front_matter, $cat_match)) {
                            $categories = $cat_match[1];
                        } else {
                            $categories = '';
                        }
                        
                        $projects[] = [
                            'filename' => $filename,
                            'title' => $title,
                            'description' => $description,
                            'categories' => $categories,
                            'content' => $body
                        ];
                    }
                }
            }
            
            echo json_encode(['projects' => $projects]);
            break;
            
        default:
            http_response_code(400);
            echo json_encode(['error' => 'Invalid action']);
            break;
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
